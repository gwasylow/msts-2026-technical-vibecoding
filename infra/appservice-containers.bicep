targetScope = 'resourceGroup'

@description('Azure region for the App Service plan and web apps. Defaults to the target resource group location.')
param location string = resourceGroup().location

@description('App Service plan name used by both web apps.')
param appServicePlanName string = 'asp-techvibecoding-prod'

@description('Backend web app name.')
param backendAppName string = 'web-techvibecoding-backend-api'

@description('Frontend web app name.')
param frontendAppName string = 'web-techvibecoding-frontend'

@description('Backend container repository name inside Azure Container Registry.')
param backendImageRepository string = 'backend-api'

@description('Backend container tag inside Azure Container Registry.')
param backendImageTag string = 'latest'

@description('Frontend container repository name inside Azure Container Registry.')
param frontendImageRepository string = 'frontend-webapp'

@description('Frontend container tag inside Azure Container Registry.')
param frontendImageTag string = 'latest'

@description('Optional backend container image reference. Leave empty to use the registry created by this template.')
param backendImageReference string = ''

@description('Optional frontend container image reference. Leave empty to use the registry created by this template.')
param frontendImageReference string = ''

@description('Public API base URL baked into the frontend image at build time. Keep this aligned with the image tag deployed here.')
param frontendPublicApiBaseUrl string = ''

@description('Optional tags applied to all resources.')
param tags object = {}

@description('Optional subscription ID where the Azure Container Registry is located. Only used when containerRegistryName is provided.')
param containerRegistrySubscriptionId string = subscription().subscriptionId

@description('Optional resource group name where the Azure Container Registry is located. Defaults to the deployment resource group so role assignments stay in scope.')
param containerRegistryResourceGroupName string = resourceGroup().name

@description('Optional Azure Container Registry name. When supplied, the template assigns AcrPull to the web apps using managed identity.')
param containerRegistryName string = toLower('acr${uniqueString(resourceGroup().id, location)}')

@description('Azure Container Registry SKU.')
param containerRegistrySkuName string = 'Basic'

@description('Backend container port exposed by the image.')
param backendPort int = 8080

@description('Frontend container port exposed by the image.')
param frontendPort int = 3000

var usePrivateRegistry = !empty(containerRegistryName) && !empty(containerRegistryResourceGroupName)
var containerRegistryLoginServer = '${containerRegistryName}.azurecr.io'
var backendImageReferenceResolved = empty(backendImageReference) ? '${containerRegistryLoginServer}/${backendImageRepository}:${backendImageTag}' : backendImageReference
var frontendImageReferenceResolved = empty(frontendImageReference) ? '${containerRegistryLoginServer}/${frontendImageRepository}:${frontendImageTag}' : frontendImageReference
var backendAppSettings = union({
  WEBSITES_PORT: string(backendPort)
  WEBSITES_ENABLE_APP_SERVICE_STORAGE: 'false'
  ASPNETCORE_ENVIRONMENT: 'Production'
}, {})
var frontendAppSettings = union({
  WEBSITES_PORT: string(frontendPort)
  WEBSITES_ENABLE_APP_SERVICE_STORAGE: 'false'
  NODE_ENV: 'production'
}, empty(frontendPublicApiBaseUrl) ? {} : {
  NEXT_PUBLIC_API_BASE_URL: frontendPublicApiBaseUrl
})

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: location
  sku: {
    name: containerRegistrySkuName
  }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
    policies: {
      quarantinePolicy: {
        status: 'disabled'
      }
      trustPolicy: {
        type: 'Notary'
        status: 'disabled'
      }
      retentionPolicy: {
        days: 7
        status: 'disabled'
      }
    }
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    family: 'B'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource backendWebApp 'Microsoft.Web/sites@2023-12-01' = {
  name: backendAppName
  location: location
  tags: tags
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      ftpsState: 'Disabled'
      http20Enabled: true
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      healthCheckPath: '/api/health'
      linuxFxVersion: 'DOCKER|${backendImageReferenceResolved}'
      acrUseManagedIdentityCreds: usePrivateRegistry
    }
  }
}

resource backendAppSettingsResource 'Microsoft.Web/sites/config@2023-12-01' = {
  parent: backendWebApp
  name: 'appsettings'
  properties: backendAppSettings
}

resource frontendWebApp 'Microsoft.Web/sites@2023-12-01' = {
  name: frontendAppName
  location: location
  tags: tags
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      ftpsState: 'Disabled'
      http20Enabled: true
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      healthCheckPath: '/'
      linuxFxVersion: 'DOCKER|${frontendImageReferenceResolved}'
      acrUseManagedIdentityCreds: usePrivateRegistry
    }
  }
}

resource frontendAppSettingsResource 'Microsoft.Web/sites/config@2023-12-01' = {
  parent: frontendWebApp
  name: 'appsettings'
  properties: frontendAppSettings
}

module acrPullRoleAssignments './acr-role-assignments.bicep' = if (usePrivateRegistry) {
  name: 'acrPullRoleAssignments'
  scope: resourceGroup(containerRegistrySubscriptionId, containerRegistryResourceGroupName)
  params: {
    containerRegistryName: containerRegistryName
    backendPrincipalId: backendWebApp.identity.principalId
    frontendPrincipalId: frontendWebApp.identity.principalId
  }
}

output appServicePlanId string = appServicePlan.id
output containerRegistryLoginServer string = containerRegistryLoginServer
output backendHostname string = backendWebApp.properties.defaultHostName
output frontendHostname string = frontendWebApp.properties.defaultHostName
output backendUrl string = 'https://${backendWebApp.properties.defaultHostName}'
output frontendUrl string = 'https://${frontendWebApp.properties.defaultHostName}'

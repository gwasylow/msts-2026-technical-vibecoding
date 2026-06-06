targetScope = 'resourceGroup'

@description('Azure region for all Container Apps resources. Defaults to the resource group location.')
param location string = resourceGroup().location

@description('Container Apps environment name.')
param containerAppsEnvironmentName string = 'cae-techvibecoding-prod'

@description('Backend container app name.')
param backendAppName string = 'web-techvibecoding-backend-api'

@description('Frontend container app name.')
param frontendAppName string = 'web-techvibecoding-frontend'

@description('Backend container repository name in the registry created by this template.')
param backendImageRepository string = 'backend-api'

@description('Backend container tag in the registry created by this template.')
param backendImageTag string = 'latest'

@description('Frontend container repository name in the registry created by this template.')
param frontendImageRepository string = 'frontend-webapp'

@description('Frontend container tag in the registry created by this template.')
param frontendImageTag string = 'latest'

@description('Optional backend image reference. Leave empty to use the registry created by this template.')
param backendImageReference string = ''

@description('Optional frontend image reference. Leave empty to use the registry created by this template.')
param frontendImageReference string = ''

@description('Optional public API base URL baked into the frontend image at build time.')
param frontendPublicApiBaseUrl string = ''

@description('Optional tags applied to all resources.')
param tags object = {}

@description('Registry name. Defaults to a deterministic name based on the resource group and location.')
param containerRegistryName string = toLower('acr${uniqueString(resourceGroup().id, location)}')

@description('Registry SKU.')
param containerRegistrySkuName string = 'Basic'

@description('Log Analytics workspace name used by the Container Apps environment.')
param logAnalyticsWorkspaceName string = 'law-techvibecoding-prod'

@description('Backend container port exposed by the image.')
param backendPort int = 8080

@description('Frontend container port exposed by the image.')
param frontendPort int = 3000

@description('Backend CPU allocation in vCPU units.')
param backendMemory string = '0.5Gi'

@description('Frontend memory allocation.')
param frontendMemory string = '0.5Gi'

var containerRegistryLoginServer = '${containerRegistryName}.azurecr.io'
var backendImageReferenceResolved = empty(backendImageReference) ? '${containerRegistryLoginServer}/${backendImageRepository}:${backendImageTag}' : backendImageReference
var frontendImageReferenceResolved = empty(frontendImageReference) ? '${containerRegistryLoginServer}/${frontendImageRepository}:${frontendImageTag}' : frontendImageReference
var containerAppCpu = json('0.25')
var frontendEnvironmentVariables = concat([
  {
    name: 'NODE_ENV'
    value: 'production'
  }
], empty(frontendPublicApiBaseUrl) ? [] : [
  {
    name: 'NEXT_PUBLIC_API_BASE_URL'
    value: frontendPublicApiBaseUrl
  }
])

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

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
  }
}

resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvironmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource backendContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        allowInsecure: false
        targetPort: backendPort
        transport: 'auto'
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
      }
      registries: [
        {
          server: containerRegistryLoginServer
          identity: 'system'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'backend-api'
          image: backendImageReferenceResolved
          env: [
            {
              name: 'ASPNETCORE_ENVIRONMENT'
              value: 'Production'
            }
          ]
          resources: {
            cpu: containerAppCpu
            memory: backendMemory
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

resource frontendContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        allowInsecure: false
        targetPort: frontendPort
        transport: 'auto'
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
      }
      registries: [
        {
          server: containerRegistryLoginServer
          identity: 'system'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'frontend-webapp'
          image: frontendImageReferenceResolved
          env: frontendEnvironmentVariables
          resources: {
            cpu: containerAppCpu
            memory: frontendMemory
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 1
      }
    }
  }
}

resource backendAcrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(containerRegistry.id, backendContainerApp.id, 'AcrPull')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: backendContainerApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

resource frontendAcrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(containerRegistry.id, frontendContainerApp.id, 'AcrPull')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: frontendContainerApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

output containerRegistryLoginServer string = containerRegistryLoginServer
output backendFqdn string = backendContainerApp.properties.configuration.ingress.fqdn
output frontendFqdn string = frontendContainerApp.properties.configuration.ingress.fqdn
output backendUrl string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'
output frontendUrl string = 'https://${frontendContainerApp.properties.configuration.ingress.fqdn}'

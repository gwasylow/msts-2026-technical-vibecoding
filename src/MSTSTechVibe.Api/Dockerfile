# syntax=docker/dockerfile:1.7

ARG DOTNET_VERSION=9.0

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION}-alpine AS restore
WORKDIR /src

COPY ["src/MSTSTechVibe.Api/MSTSTechVibe.Api.csproj", "src/MSTSTechVibe.Api/"]
COPY ["src/MSTSTechVibe.Application/MSTSTechVibe.Application.csproj", "src/MSTSTechVibe.Application/"]
COPY ["src/MSTSTechVibe.Infrastructure/MSTSTechVibe.Infrastructure.csproj", "src/MSTSTechVibe.Infrastructure/"]
COPY ["src/MSTSTechVibe.Domain/MSTSTechVibe.Domain.csproj", "src/MSTSTechVibe.Domain/"]

RUN dotnet restore "src/MSTSTechVibe.Api/MSTSTechVibe.Api.csproj" --nologo

FROM restore AS publish
COPY src ./src
RUN dotnet publish "src/MSTSTechVibe.Api/MSTSTechVibe.Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false \
    /p:ContinuousIntegrationBuild=true \
    --nologo

FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}-alpine AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    DOTNET_EnableDiagnostics=0 \
    COMPlus_EnableDiagnostics=0

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=publish /app/publish ./

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/api/health || exit 1

EXPOSE 8080
USER appuser

ENTRYPOINT ["dotnet", "MSTSTechVibe.Api.dll"]
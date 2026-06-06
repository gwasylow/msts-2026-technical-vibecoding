using Microsoft.Extensions.DependencyInjection;
using MSTSTechVibe.Application.Abstractions.Authentication;
using MSTSTechVibe.Application.Abstractions.Persistence;
using MSTSTechVibe.Infrastructure.Authentication;
using MSTSTechVibe.Infrastructure.Persistence;

namespace MSTSTechVibe.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserContext, HttpUserContext>();
        services.AddSingleton<IVibeMessageRepository, InMemoryVibeMessageRepository>();

        return services;
    }
}
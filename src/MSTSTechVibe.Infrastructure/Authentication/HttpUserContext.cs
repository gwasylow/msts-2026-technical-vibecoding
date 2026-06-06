using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using MSTSTechVibe.Application.Abstractions.Authentication;

namespace MSTSTechVibe.Infrastructure.Authentication;

public sealed class HttpUserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId =>
        FindClaimValue(ClaimTypes.NameIdentifier)
        ?? FindClaimValue("sub")
        ?? FindClaimValue("id");

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true;

    private string? FindClaimValue(string claimType)
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst(claimType)?.Value;
    }
}
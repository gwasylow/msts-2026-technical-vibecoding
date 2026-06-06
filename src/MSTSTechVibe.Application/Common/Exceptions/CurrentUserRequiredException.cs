namespace MSTSTechVibe.Application.Common.Exceptions;

public sealed class CurrentUserRequiredException : Exception
{
    public CurrentUserRequiredException()
        : base("An authenticated user is required for this operation.")
    {
    }
}
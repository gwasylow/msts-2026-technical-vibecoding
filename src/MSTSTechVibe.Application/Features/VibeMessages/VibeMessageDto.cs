using MSTSTechVibe.Domain.Entities;

namespace MSTSTechVibe.Application.Features.VibeMessages;

public sealed record VibeMessageDto(
    Guid Id,
    string Title,
    string Description,
    DateTimeOffset CreatedAtUtc,
    string CreatedByUserId)
{
    public static VibeMessageDto FromEntity(VibeMessage vibeMessage)
    {
        return new VibeMessageDto(
            vibeMessage.Id,
            vibeMessage.Title,
            vibeMessage.Description,
            vibeMessage.CreatedAtUtc,
            vibeMessage.CreatedByUserId);
    }
}
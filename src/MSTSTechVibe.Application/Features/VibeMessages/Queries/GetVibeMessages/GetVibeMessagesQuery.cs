using MediatR;

namespace MSTSTechVibe.Application.Features.VibeMessages.Queries.GetVibeMessages;

public sealed record GetVibeMessagesQuery : IRequest<IReadOnlyCollection<VibeMessageDto>>;
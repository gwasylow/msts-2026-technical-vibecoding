using MediatR;
using MSTSTechVibe.Application.Abstractions.Authentication;
using MSTSTechVibe.Application.Abstractions.Persistence;
using MSTSTechVibe.Application.Common.Exceptions;

namespace MSTSTechVibe.Application.Features.VibeMessages.Queries.GetVibeMessages;

public sealed class GetVibeMessagesQueryHandler : IRequestHandler<GetVibeMessagesQuery, IReadOnlyCollection<VibeMessageDto>>
{
    private readonly IVibeMessageRepository _vibeMessageRepository;
    private readonly IUserContext _userContext;

    public GetVibeMessagesQueryHandler(IVibeMessageRepository vibeMessageRepository, IUserContext userContext)
    {
        _vibeMessageRepository = vibeMessageRepository;
        _userContext = userContext;
    }

    public async Task<IReadOnlyCollection<VibeMessageDto>> Handle(GetVibeMessagesQuery request, CancellationToken cancellationToken)
    {
        if (!_userContext.IsAuthenticated || string.IsNullOrWhiteSpace(_userContext.UserId))
        {
            throw new CurrentUserRequiredException();
        }

        var vibeMessages = await _vibeMessageRepository.GetAllAsync(cancellationToken);

        return vibeMessages
            .OrderByDescending(vibeMessage => vibeMessage.CreatedAtUtc)
            .Select(VibeMessageDto.FromEntity)
            .ToArray();
    }
}
using MediatR;
using MSTSTechVibe.Application.Abstractions.Authentication;
using MSTSTechVibe.Application.Abstractions.Persistence;
using MSTSTechVibe.Application.Common.Exceptions;
using MSTSTechVibe.Domain.Entities;

namespace MSTSTechVibe.Application.Features.VibeMessages.Commands.CreateVibeMessage;

public sealed class CreateVibeMessageCommandHandler : IRequestHandler<CreateVibeMessageCommand, VibeMessageDto>
{
    private readonly IVibeMessageRepository _vibeMessageRepository;
    private readonly IUserContext _userContext;

    public CreateVibeMessageCommandHandler(IVibeMessageRepository vibeMessageRepository, IUserContext userContext)
    {
        _vibeMessageRepository = vibeMessageRepository;
        _userContext = userContext;
    }

    public async Task<VibeMessageDto> Handle(CreateVibeMessageCommand request, CancellationToken cancellationToken)
    {
        if (!_userContext.IsAuthenticated || string.IsNullOrWhiteSpace(_userContext.UserId))
        {
            throw new CurrentUserRequiredException();
        }

        var vibeMessage = VibeMessage.Create(request.Title, request.Description, _userContext.UserId);
        var savedVibeMessage = await _vibeMessageRepository.AddAsync(vibeMessage, cancellationToken);

        return VibeMessageDto.FromEntity(savedVibeMessage);
    }
}
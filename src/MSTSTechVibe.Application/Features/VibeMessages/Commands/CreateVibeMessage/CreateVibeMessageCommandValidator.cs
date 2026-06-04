using FluentValidation;

namespace MSTSTechVibe.Application.Features.VibeMessages.Commands.CreateVibeMessage;

public sealed class CreateVibeMessageCommandValidator : AbstractValidator<CreateVibeMessageCommand>
{
    public CreateVibeMessageCommandValidator()
    {
        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(command => command.Description)
            .NotEmpty()
            .MaximumLength(1000);
    }
}
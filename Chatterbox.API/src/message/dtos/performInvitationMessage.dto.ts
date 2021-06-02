export class PerformInvitationMessageDto
{
    action: PerformInvitationAction;
    messageId: string;
}

export enum PerformInvitationAction
{
    ACCEPT = 'ACCEPT',
    DECLINE = 'DECLINE'
}
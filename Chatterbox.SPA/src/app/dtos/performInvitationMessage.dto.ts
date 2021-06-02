import { PerformInvitationAction } from "../inbox/inbox.component";

export interface PerformInvitationMessageDto
{
    action: PerformInvitationAction;
    messageId: string;
}
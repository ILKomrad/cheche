import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'meetingsPipe'
})
export class MeetingsPipe {
    transform(meetings, userId) {
        if (userId) {
            return meetings.filter(m => {
                return (m.firstPlayer !== userId && !m.bot);
            });
        } else {
            return meetings;
        }
        // return meetings;
    }
}
# Necromancer

Manage availability and schedule for Team Ghost

## Schedules

- Availability Poll: Posted every Friday, if availability channel is set

## Admin

- `/admin set-channel availability [channel]` - Sets the channel to post the availability poll
- `/admin set-role team-member [role]` - Sets the role which is assigned to team members
- `/admin set-role trial [role]` - Sets the role which is assigned to trial members

## Availability

- `/availability query` - Posts the availability poll in the relevant channel. If the channel is unset, it defaults to the current channel

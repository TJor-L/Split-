import 'package:flutter/material.dart';
import 'package:frontend/services/api_service.dart';

class NotificationScreen extends StatelessWidget {
  final List<Map<String, String>> notifications = [
    {'type': 'friend', 'user': 'Alice'},
    {'type': 'group', 'user': 'Bob'}
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
      ),
      body: ListView.builder(
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notification = notifications[index];
          return ListTile(
            leading: CircleAvatar(
              child: Text(notification['user']![0]),
            ),
            title: Text(
              notification['type'] == 'friend'
                  ? '${notification['user']} sent you a friend request'
                  : '${notification['user']} sent you an invitation',
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextButton(
                  onPressed: () {
                    handleAccept(notification);
                  },
                  child: Text('Accept'),
                ),
                TextButton(
                  onPressed: () {
                    handleDecline(notification);
                  },
                  child: Text('Decline'),
                ),
              ],
            ),
            onTap: () {
              // Handle notification tap
            },
          );
        },
      ),
    );
  }
}

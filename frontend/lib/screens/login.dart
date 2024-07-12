import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:frontend/main.dart';
import 'package:frontend/services/api_service.dart';
import 'package:frontend/services/google_auth.dart';
import 'package:frontend/services/api_service.dart';
import 'package:http/http.dart';

class GoogleButton extends StatelessWidget {
  const GoogleButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      IconButton(
        icon: Image.asset('lib/images/google.jpg'),
        iconSize: 50,
        onPressed: () async {
          UserCredential userCredential =
              await AuthService().signInWithGoogle();
          if (userCredential.user != null) {
            // User signed in successfully
            User user = userCredential.user!;

            // Access user information
            String userId = user.uid;
            String? displayName = user.displayName;
            String? email = user.email;
            if (displayName != null && email != null) {
              Map<String, dynamic> res =
                  await createUser(userId, displayName, email);
              SplitUser currentUser = new SplitUser(
                  userId: res['user_id'],
                  displayName: res['display_name'],
                  email: res['email']);
              initialInfo.groupIds = res['groups'];
              initialInfo.updateCurrentUser(currentUser);
            } else {
              print('Sign-in failed. User name or email is Null!');
              return null;
            }
            // Return the signed-in user
          } else {
            // Sign-in failed
            print('Sign-in failed. User credentials not available.');
            return null;
          }
        },
      ),
    ]);
  }
}

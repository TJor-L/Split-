import 'dart:async';
import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:frontend/screens/groups.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:frontend/config.dart';


final String _baseUrl = BASE_URL;
final int _port = PORT;

Future<Response> sendPost(String url, String json_body) async {
  final response = await http.post(
    Uri.parse(url),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: json_body,
  );
  return response;
}

Future<Map<String, dynamic>> createUser(
  String userId,
  String displayName,
  String email,
) async {
  String jsonBody = jsonEncode(<String, String>{
    'user_id': userId,
    'display_name': displayName,
    'email': email,
  });
  final response =
      await sendPost('https://jsonplaceholder.typicode.com/albums', jsonBody);

  if (response.statusCode == 201) {
    // If the server did return a 201 CREATED response,
    // then parse the JSON.
    print(response.body);
    Map<String, dynamic> add_msg = jsonDecode(response.body);
    return add_msg;
  } else {
    // If the server did not return a 201 CREATED response,
    // then throw an exception.
    throw Exception('Failed to create user.');
  }
}

Future<void> handleAccept(Map<String, String> notification) async {
  String jsonBody = jsonEncode(notification);
  final response =
  await sendPost('$_baseUrl:$_port/accept', jsonBody);

  if (response.statusCode == 200) {
    // Handle success
    print('Accepted ${notification['user']} request');
    } else {
    // Handle error
    throw Exception('Failed to accept request.');
    }
    }

Future<void> handleDecline(Map<String, String> notification) async {
  String jsonBody = jsonEncode(notification);
  final response =
  await sendPost('$_baseUrl:$_port/decline', jsonBody);

  if (response.statusCode == 200) {
    // Handle success
    print('Declined ${notification['user']} request');
    } else {
    // Handle error
    throw Exception('Failed to decline request.');
    }
    }

class SplitUser {
  final String userId;
  final String displayName;
  final String email;

  const SplitUser(
      {required this.userId, required this.displayName, required this.email});

  factory SplitUser.fromJson(Map<String, dynamic> json) => switch (json) {
        {
          'user_id': String userId,
          'display_name': String displayName,
          'email': String email,
        } =>
          SplitUser(
            userId: userId,
            displayName: displayName,
            email: email,
          ),
        _ => throw FormatException('Failed to load SplitUser.'),
      };
}

class InfoInitialization {
  ValueNotifier<SplitUser?> currentUser = ValueNotifier<SplitUser?>(null);
  List<String> groupIds = [];

  void updateCurrentUser(SplitUser? user) {
    currentUser.value = user;
  }

  // Function to get the current user
  SplitUser? getCurrentUser() {
    return currentUser.value;
  }
}

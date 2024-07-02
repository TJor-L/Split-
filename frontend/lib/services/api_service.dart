import 'dart:async';
import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

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

Future<SplitUser> createUser(
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
    return SplitUser.fromJson(
        jsonDecode(response.body) as Map<String, dynamic>);
  } else {
    // If the server did not return a 201 CREATED response,
    // then throw an exception.
    throw Exception('Failed to create user.');
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

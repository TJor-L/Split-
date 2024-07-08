import 'dart:convert';
import 'dart:js_interop';

import 'package:flutter/material.dart';
import 'package:frontend/services/api_service.dart';
import 'package:frontend/services/name_tag.dart';
import 'package:http/http.dart';

class CreateGroup extends StatefulWidget {
  const CreateGroup({super.key});

  @override
  State<CreateGroup> createState() => _CreateGroupState();
}

class _CreateGroupState extends State<CreateGroup> {
  final _addMemberController = TextEditingController();
  List<String> memberList = ['asds', 'as3'];

  void addString(String value) {
    setState(() {
      memberList.add(value);
    });
    _addMemberController.clear();
  }

  void removeString(String value) {
    setState(() {
      memberList.remove(value);
    });
  }

  @override
  void dispose() {
    _addMemberController.dispose();
    super.dispose();
  }

  Future<void> handleAdd() async {
    if (_addMemberController.text.trim().isEmpty) {
      print("Email cannot be empty!");
      return;
    }
    String memberEmail = _addMemberController.text.trim();
    print(memberEmail);
    addString(memberEmail);

    // String jsonBody =
    //     jsonEncode(<String, String>{'email': _addMemberController.text.trim()});
    // String add_user_url =
    //     "https://jsonplaceholder.typicode.com/albums"; //should replace with real post url
    // Response response = await sendPost(add_user_url, jsonBody);
    // _addMemberController.clear();
  }

  Future<void> handleSubmit() async {
    if (_addMemberController.text.trim().isEmpty) {
      print("Email cannot be empty!");
      return;
    }

    print(_addMemberController.text);

    String jsonBody = jsonEncode(<String, List>{'email_list': memberList});
    String add_group_url =
        "https://jsonplaceholder.typicode.com/albums"; //should replace with real post url
    Response response = await sendPost(add_group_url, jsonBody);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
                height: 75,
                color: Colors.white,
                child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: memberList.length,
                    itemBuilder: (contex, index) {
                      return InkWell(
                          onTap: () => removeString(memberList[index]),
                          child: NameTag(str: memberList[index]));
                    })),
            const Divider(
              thickness: 1,
            ),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _addMemberController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter email',
                    ),
                  ),
                ),
                SizedBox(width: 10),
                SizedBox(
                  width: 80,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: handleAdd,
                    child: Text('Add Member'),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(horizontal: 10),
                    ),
                  ),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: handleSubmit,
              child: Text('Submit'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 10),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

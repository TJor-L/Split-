import 'dart:convert';
import 'dart:js_interop';

import 'package:flutter/material.dart';
import 'package:frontend/main.dart';
import 'package:frontend/screens/groups.dart';
import 'package:frontend/services/api_service.dart';
import 'package:frontend/services/name_tag.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';

class CreateGroup extends StatefulWidget {
  const CreateGroup({super.key});

  @override
  State<CreateGroup> createState() => _CreateGroupState();
}

class _CreateGroupState extends State<CreateGroup> {
  /// url to be replaced
  String add_user_url = "add_user_url?";
  String add_group_url = "add_group_url?";

  ///
  final _addMemberController = TextEditingController();
  final _groupNameController = TextEditingController();
  List<SplitUser> memberList = [];

  void addString(SplitUser user) {
    setState(() {
      memberList.add(user);
    });
    _addMemberController.clear();
  }

  void removeString(SplitUser user) {
    setState(() {
      memberList.remove(user);
    });
  }

  @override
  void dispose() {
    _addMemberController.dispose();
    _groupNameController.dispose();
    super.dispose();
  }

  Future<void> handleAdd() async {
    if (_addMemberController.text.trim().isEmpty) {
      showDialog(
          context: context,
          builder: (ctx) {
            return AlertDialog(
              content: const Text("Missing Added Member Email"),
              actions: [
                TextButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                    },
                    child: const Text("close"))
              ],
              actionsAlignment: MainAxisAlignment.center,
            );
          });
      return;
    }
    String memberEmail = _addMemberController.text.trim();
    print(memberEmail);
    final queryParameters = {
      'email': memberEmail,
    };
    final uri =
        Uri.parse(add_user_url).replace(queryParameters: queryParameters);
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      // If the server did return a 201 CREATED response,
      // then parse the JSON.
      print(response.body);
      Map<String, dynamic> add_msg = jsonDecode(response.body);
      if (add_msg['success'] == true) {
        String curDisplayName = add_msg['display_name'];
        String curUserId = add_msg['user_id'];
        String curUserEmail = add_msg['email'];
        SplitUser curUser = SplitUser(
            userId: curUserId,
            displayName: curDisplayName,
            email: curUserEmail);
        addString(curUser);
      } else {
        print("add failed");
      }
    } else {
      // If the server did not return a 201 CREATED response,
      // then throw an exception.
      throw Exception('Failed to create user.');
    }
  }

  Future<void> handleSubmit() async {
    if (memberList.isEmpty) {
      showDialog(
          context: context,
          builder: (ctx) {
            return AlertDialog(
              content: const Text("Missing Members to be Added!"),
              actions: [
                TextButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                    },
                    child: const Text("close"))
              ],
              actionsAlignment: MainAxisAlignment.center,
            );
          });
      return;
    }
    if (_groupNameController.text.trim().isEmpty) {
      showDialog(
          context: context,
          builder: (ctx) {
            return AlertDialog(
              content: const Text("Missing Group Name1"),
              actions: [
                TextButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                    },
                    child: const Text("close"))
              ],
              actionsAlignment: MainAxisAlignment.center,
            );
          });
      return;
    }
    String groupName = _groupNameController.text.trim();
    SplitUser? currentUser = initialInfo.getCurrentUser();
    if (currentUser != null) {
      memberList.add(currentUser);
    }
    List<String> names = [];
    for (SplitUser u in memberList) {
      names.add(u.email);
    }
    String jsonBody =
        jsonEncode(<String, dynamic>{'members': names, 'name': groupName});

    Response response = await sendPost(add_group_url, jsonBody);
    print(response.body);
    if (response.statusCode == 200) {
      Map<String, dynamic> add_msg = jsonDecode(response.body);
      if (add_msg['success'] == true) {
        // String curDisplayName = add_msg['display_name'];
        // String curUserId = add_msg['user_id'];
        // String curUserEmail = add_msg['email'];
        // SplitUser curUser = SplitUser(
        //   userId: curUserId,
        //   displayName: curDisplayName,
        //   email: curUserEmail
        // );
        // addString(curUser);
        initialInfo.groupIds.add(add_msg['group_id']);
        Navigator.push(
            context, MaterialPageRoute(builder: (ctx) => GroupScreen()));
      } else {
        print("create failed");
      }
    } else {
      throw Exception('Failed to create group.');
    }
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
                          child: NameTag(str: memberList[index].displayName));
                    })),
            const Divider(
              thickness: 1,
            ),
            Row(
              children: [
                SizedBox(width: 10),
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
                SizedBox(width: 10),
              ],
            ),
            SizedBox(height: 20),
            Row(
              children: [
                SizedBox(width: 10),
                Expanded(
                  child: TextField(
                    controller: _groupNameController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Enter Group Name',
                    ),
                  ),
                ),
                SizedBox(width: 10),
              ],
            ),
            SizedBox(height: 40),
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

import 'package:flutter/material.dart';

class NameTag extends StatelessWidget {
  const NameTag({super.key, required this.str});
  final String str;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 5),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Stack(
            children: [
              Container(
                padding: EdgeInsets.all(8.0),
                decoration: const BoxDecoration(
                  color: Color(0xFFE6E0EE), //traditional light purple
                ),
                child: Text(
                  str,
                  style: TextStyle(fontSize: 16),
                ),
              ),
              const Positioned(
                  bottom: 2,
                  right: 1,
                  child: CircleAvatar(
                      backgroundColor: Colors.blueGrey,
                      radius: 5,
                      child: Icon(Icons.clear, color: Colors.white, size: 8)))
            ],
          ),
        ],
      ),
    );
  }
}

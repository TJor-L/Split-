import 'package:demo_project/select_item.dart';
import 'package:demo_project/select_people.dart';
import 'package:flutter/material.dart';

class SelectScreen extends StatefulWidget {
  const SelectScreen({super.key});

  @override
  State<SelectScreen> createState() => _SelectScreenState();
}

class _SelectScreenState extends State<SelectScreen> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: MediaQuery.sizeOf(context).height * 0.2,
          child: const ScrollableMerch(),
        ),
        SizedBox(height: MediaQuery.sizeOf(context).height * 0.06),
        const Expanded(
          child: ScrollableSelectableList(),
        ),
      ],
    );
  }
}

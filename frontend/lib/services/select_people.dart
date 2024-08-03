import 'dart:collection';

import 'package:flutter/material.dart';

class ScrollableSelectableList extends StatefulWidget {
  const ScrollableSelectableList({super.key});

  @override
  State<ScrollableSelectableList> createState() =>
      _ScrollableSelectableListState();
}

class _ScrollableSelectableListState extends State<ScrollableSelectableList> {
  int selectedIndex = -1;
  HashSet<String> selectedItems = HashSet<String>();
  //should change to a list of self-defined class for purchased objects later!!

  List<String> items = List.generate(20, (index) => 'Item ${index + 1}');

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        return SelectableItem(
          item: items[index],
          isSelected: selectedItems.contains(items[index]),
          onSelect: () {
            setState(() {
              if (selectedItems.contains(items[index])) {
                selectedItems.remove(items[index]);
              } else {
                selectedItems.add(items[index]);
              }
            });
          },
        );
      },
    );
  }
}

class SelectableItem extends StatelessWidget {
  final String item;
  final bool isSelected;
  final VoidCallback onSelect;

  const SelectableItem({
    super.key,
    required this.item,
    required this.isSelected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      child: InkWell(
        onTap: onSelect,
        child: Container(
          height: MediaQuery.sizeOf(context).height * 0.15,
          padding: const EdgeInsets.all(16),
          color: isSelected ? Colors.blue.withOpacity(0.3) : null,
          child: Text(
            item,
            style: TextStyle(
              fontSize: 18,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}

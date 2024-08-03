import 'package:flutter/material.dart';

class ScrollableMerch extends StatefulWidget {
  const ScrollableMerch({super.key});
  @override
  State<ScrollableMerch> createState() => _ScrollableMerchState();
}

class _ScrollableMerchState extends State<ScrollableMerch> {
  int selectedIndex = 0;
  final ScrollController _scrollController = ScrollController();
  final int itemCount = 20;
  // final double itemWidth = 80.0;
  final double itemMargin = 5.0;
  @override
  Widget build(BuildContext context) {
    return Material(
      child: ListView.builder(
        controller: _scrollController,
        scrollDirection: Axis.horizontal,
        itemCount: itemCount,
        itemBuilder: (context, index) {
          return InkWell(
            onTap: () {
              setState(() {
                selectedIndex = index;
              });
              _scrollToOptimalPosition(index);
            },
            child: Container(
              width: MediaQuery.sizeOf(context).width * 0.2,
              margin: EdgeInsets.symmetric(horizontal: itemMargin),
              decoration: BoxDecoration(
                color: selectedIndex == index ? Colors.blue : Colors.grey[300],
                borderRadius: BorderRadius.circular(20),
              ),
              child: Center(
                  child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  'Item ${index + 1}',
                  style: TextStyle(
                    fontSize: 20,
                    color: selectedIndex == index ? Colors.white : Colors.black,
                  ),
                ),
              )),
            ),
          );
        },
      ),
    );
  }

  void _scrollToOptimalPosition(int index) {
    final screenWidth = MediaQuery.of(context).size.width;
    final itemTotalWidth =
        MediaQuery.sizeOf(context).width * 0.2 + (itemMargin * 2);
    final listViewWidth = itemTotalWidth * itemCount;
    final halfScreenWidth = screenWidth / 2;
    final halfItemWidth = itemTotalWidth / 2;

    double targetOffset =
        (index * itemTotalWidth) - halfScreenWidth + halfItemWidth;

    // Ensure we don't scroll past the start of the list
    targetOffset = targetOffset.clamp(0.0, listViewWidth - screenWidth);

    _scrollController.animateTo(
      targetOffset,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }
}

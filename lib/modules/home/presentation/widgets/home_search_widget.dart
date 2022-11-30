import 'package:flutter/material.dart';

import '../../../core/constants/app_colors.dart';

class SearchWidget extends StatelessWidget {
  const SearchWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18),
      padding: const EdgeInsets.only(left: 8),
      height: 40,
      decoration: BoxDecoration(
          border: Border.all(color: AppColors.grey, width: 1),
          borderRadius: BorderRadius.circular(6)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: const [
          Icon(Icons.search),
          SizedBox(
            width: 8,
          ),
          Expanded(
              child: TextField(
            style: TextStyle(fontFamily: "ManropeRegular", fontSize: 14),
            decoration: InputDecoration(
                border: InputBorder.none,
                isCollapsed: true,
                hintText: "Search restaurants or foods..."),
          ))
        ],
      ),
    );
  }
}

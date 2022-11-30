import 'package:flutter/material.dart';

import '../../../core/constants/app_colors.dart';

class SearchWidget extends StatelessWidget {
  const SearchWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18),
      padding: const EdgeInsets.symmetric(horizontal: 8),
      height: 40,
      decoration: BoxDecoration(
          border: Border.all(color: AppColors.grey, width: 1),
          borderRadius: BorderRadius.circular(6)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Icon(Icons.search),
          const SizedBox(
            width: 5,
          ),
          const Expanded(
              child: TextField(
            style: TextStyle(fontFamily: "ManropeRegular", fontSize: 14),
            decoration: InputDecoration(
                border: InputBorder.none,
                isCollapsed: true,
                hintText: "Search restaurants or foods..."),
          )),
          Material(
            borderRadius: BorderRadius.circular(5),
            color: AppColors.whiteShade,
            child: InkWell(
              onTap: () {
                if (Scaffold.of(context).hasEndDrawer) {
                  Scaffold.of(context).openEndDrawer();
                }
              },
              borderRadius: BorderRadius.circular(5),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                height: 28,
                decoration:
                    BoxDecoration(borderRadius: BorderRadius.circular(5)),
                child: Center(
                  child: Text(
                    "Filter",
                    style: TextStyle(
                        fontFamily: "ManropeBold",
                        color: AppColors.greyDark,
                        fontSize: 12),
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

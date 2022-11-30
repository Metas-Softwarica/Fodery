import 'package:flutter/material.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';
import 'package:fodery/modules/core/ui/widgets/fod_auth_button.dart';

import 'filter_chip_widget.dart';

class FilterWidget extends StatefulWidget {
  const FilterWidget({super.key});

  @override
  State<FilterWidget> createState() => _FilterWidgetState();
}

class _FilterWidgetState extends State<FilterWidget> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                    onPressed: () {
                      Scaffold.of(context).closeEndDrawer();
                    },
                    icon: const Icon(Icons.cancel)),
                Text(
                  "Filter",
                  style: TextStyle(
                      fontFamily: "ManropeBold",
                      fontSize: 16,
                      color: AppColors.greyDark),
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Food Types",
                      style: TextStyle(
                          fontFamily: "ManropeRegular",
                          fontSize: 14,
                          color: Colors.white),
                    ),
                    const SizedBox(
                      height: 4,
                    ),
                    Wrap(
                      spacing: 8,
                      runSpacing: 0,
                      children: const [
                        FilterChipWidget(
                          label: "Appetizer",
                        ),
                        FilterChipWidget(
                          label: "Main Course",
                        ),
                        FilterChipWidget(
                          label: "Snacks",
                        ),
                        FilterChipWidget(
                          label: "Dessert",
                        ),
                        FilterChipWidget(
                          label: "Soups",
                        ),
                        FilterChipWidget(
                          label: "Hot Drinks",
                        )
                      ],
                    ),
                    const Text(
                      "Diets",
                      style: TextStyle(
                          fontFamily: "ManropeRegular",
                          fontSize: 14,
                          color: Colors.white),
                    ),
                    const SizedBox(
                      height: 4,
                    ),
                    Wrap(
                      spacing: 8,
                      runSpacing: 0,
                      children: const [
                        FilterChipWidget(
                          label: "Classic",
                        ),
                        FilterChipWidget(
                          label: "Vegetarian",
                        ),
                        FilterChipWidget(
                          label: "Vegan",
                        ),
                        FilterChipWidget(
                          label: "Pescetarian",
                        ),
                        FilterChipWidget(
                          label: "Flexitarian",
                        ),
                        FilterChipWidget(
                          label: "Low-carbohydrates",
                        ),
                        FilterChipWidget(
                          label: "Low-carbohydrates",
                        ),
                        FilterChipWidget(
                          label: "Keto",
                        ),
                        FilterChipWidget(
                          label: "Paleo",
                        )
                      ],
                    ),
                    const SizedBox(
                      height: 14,
                    ),
                  ],
                ),
              ),
            ),
          ),
          FODButton(text: "Submit"),
          SizedBox(
            height: 14,
          )
        ],
      ),
    );
  }
}

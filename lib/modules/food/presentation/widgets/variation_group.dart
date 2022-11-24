import 'package:flutter/material.dart';

import '../../../core/constants/app_colors.dart';

class VariationGroup extends StatefulWidget {
  const VariationGroup({super.key});

  @override
  State<VariationGroup> createState() => _VariationGroupState();
}

class _VariationGroupState extends State<VariationGroup> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 18),
          child: Text(
            "Size",
            style: TextStyle(
              fontFamily: "ManropeBold",
            ),
          ),
        ),
        const SizedBox(
          height: 8,
        ),
        SizedBox(
          height: 34,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              Container(
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                    color: AppColors.whiteShade,
                    borderRadius: BorderRadius.circular(6)),
                child: const Center(
                  child: Text("Small",
                      style: TextStyle(fontFamily: "ManropeBold")),
                ),
              ),
              Container(
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                    color: AppColors.whiteShade,
                    borderRadius: BorderRadius.circular(6)),
                child: const Center(
                  child: Text("Large",
                      style: TextStyle(fontFamily: "ManropeBold")),
                ),
              )
            ],
          ),
        )
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:vrouter/vrouter.dart';

import '../../../core/constants/app_colors.dart';
import '../../../food/data/models/food_model.dart';

class FoodWidget extends StatelessWidget {
  final FoodModel foodModel;
  final int index;
  const FoodWidget({super.key, required this.foodModel, required this.index});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () {
        context.vRouter.toNamed(FOOD_DETAIL_ROUTE,
            queryParameters: {"id": index.toString()});
      },
      child: SizedBox(
        width: 140,
        child: Column(
          children: [
            Container(
              height: 160,
              decoration: BoxDecoration(
                  image: (foodModel.imageUrl != null)
                      ? DecorationImage(
                          fit: BoxFit.cover,
                          image: NetworkImage(foodModel.imageUrl!))
                      : null,
                  color: AppColors.whiteShade,
                  borderRadius: BorderRadius.circular(12)),
            ),
            Padding(
              padding: const EdgeInsets.all(3),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    foodModel.name ?? "",
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontFamily: "ManropeRegular",
                      fontSize: 13,
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "\$ ${foodModel.price ?? ""}",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: "ManropeBold",
                          fontSize: 16,
                        ),
                      ),
                      Icon(
                        Icons.add_box,
                        color: AppColors.red,
                      )
                    ],
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

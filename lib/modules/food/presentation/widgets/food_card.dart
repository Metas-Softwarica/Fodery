import 'package:flutter/material.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:vrouter/vrouter.dart';

import '../../../core/constants/app_colors.dart';
import '../../data/models/food_model.dart';

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

class FoodHorizontalCard extends StatelessWidget {
  final FoodModel foodModel;
  final int index;
  const FoodHorizontalCard(
      {super.key, required this.foodModel, required this.index});

  @override
  Widget build(BuildContext context) {
    return InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          context.vRouter.toNamed(FOOD_DETAIL_ROUTE,
              queryParameters: {"id": index.toString()});
        },
        child: Stack(
          children: [
            Container(
              height: 80,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: AppColors.whiteShade),
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                        image: (foodModel.imageUrl != null)
                            ? DecorationImage(
                                fit: BoxFit.cover,
                                image: NetworkImage(foodModel.imageUrl!))
                            : null,
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8)),
                  ),
                  const SizedBox(
                    width: 10,
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        foodModel.name ?? "",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: "ManropeRegular",
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(
                        height: 3,
                      ),
                      Text(
                        "\$ ${foodModel.price ?? ""}",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: "ManropeBold",
                          fontSize: 16,
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
            Positioned(
                right: 14,
                bottom: 14,
                child: Icon(
                  Icons.add_box,
                  color: AppColors.red,
                ))
          ],
        ));
  }
}

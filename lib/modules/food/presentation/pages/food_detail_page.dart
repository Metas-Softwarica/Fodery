import 'package:flutter/material.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';
import 'package:fodery/modules/food/data/models/food_model.dart';
import 'package:fodery/modules/food/presentation/widgets/addon_card.dart';
import 'package:fodery/modules/food/presentation/widgets/variation_group.dart';
import 'package:vrouter/vrouter.dart';

class FoodDetailScreen extends StatefulWidget {
  const FoodDetailScreen({super.key});

  @override
  State<FoodDetailScreen> createState() => _FoodDetailScreenState();
}

class _FoodDetailScreenState extends State<FoodDetailScreen> {
  @override
  Widget build(BuildContext context) {
    FoodModel foodModel =
        testFoodModel[int.parse(context.vRouter.queryParameters["id"]!)];
    print(foodModel.name);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  Container(
                    width: MediaQuery.of(context).size.width,
                    height: 340,
                    decoration: BoxDecoration(
                      color: AppColors.whiteShade,
                      image: (foodModel.imageUrl != null)
                          ? DecorationImage(
                              fit: BoxFit.cover,
                              image: NetworkImage(foodModel.imageUrl!))
                          : null,
                    ),
                  ),
                  Positioned(
                    top: 18,
                    left: 18,
                    child: InkWell(
                      onTap: () {
                        context.vRouter.historyBack();
                      },
                      child: Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                            color: Colors.black,
                            borderRadius: BorderRadius.circular(8)),
                        child: const Icon(Icons.arrow_back_ios_rounded,
                            color: Colors.white),
                      ),
                    ),
                  )
                ],
              ),
              const SizedBox(
                height: 14,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      foodModel.name ?? "",
                      style:
                          TextStyle(fontFamily: "ManropeRegular", fontSize: 18),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      foodModel.description ?? "",
                      style: TextStyle(
                          fontFamily: "ManropeRegular",
                          fontSize: 14,
                          color: AppColors.greyDark),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 14,
              ),
              const VariationGroup(),
              const SizedBox(
                height: 14,
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 18),
                child: Text(
                  "Addons",
                  style: TextStyle(
                    fontFamily: "ManropeBold",
                  ),
                ),
              ),
              const SizedBox(
                height: 8,
              ),
              SizedBox(
                height: 190,
                child: ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.only(left: 18, right: 4),
                    scrollDirection: Axis.horizontal,
                    itemCount: 1,
                    itemBuilder: ((context, index) {
                      return const Padding(
                        padding: EdgeInsets.only(right: 14),
                        child: AddonWidget(),
                      );
                    })),
              ),
              const SizedBox(
                height: 14,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

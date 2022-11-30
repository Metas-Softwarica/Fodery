import 'package:flutter/material.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:fodery/modules/core/ui/wrapper/screen_wrapper.dart';
import 'package:fodery/modules/food/data/models/food_model.dart';
import 'package:fodery/modules/food/presentation/widgets/food_card.dart';
import 'package:fodery/modules/restaurant/presentation/widgets/restaurant_card.dart';
import 'package:fodery/modules/search/presentation/widgets/filter_widget.dart';
import 'package:fodery/modules/search/presentation/widgets/search_widget.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
      route: SEARCH_ROUTE,
      endDrawer: Drawer(
          backgroundColor: AppColors.black,
          width: 260,
          child: const FilterWidget()),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(
            height: 18,
          ),
          const SearchWidget(),
          Expanded(
              child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(
                  height: 14,
                ),
                const Padding(
                  padding: EdgeInsets.only(left: 18),
                  child: Text(
                    "Food Results",
                    style: TextStyle(fontFamily: "ManropeBold", fontSize: 16),
                  ),
                ),
                ListView.builder(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 18, vertical: 14),
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: 5,
                    shrinkWrap: true,
                    itemBuilder: ((context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: FoodHorizontalCard(
                            index: 0, foodModel: testFoodModel[0]),
                      );
                    })),
                const Padding(
                  padding: EdgeInsets.only(left: 18),
                  child: Text(
                    "Restaurant Results",
                    style: TextStyle(fontFamily: "ManropeBold", fontSize: 16),
                  ),
                ),
                ListView.builder(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 18, vertical: 14),
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: 5,
                    shrinkWrap: true,
                    itemBuilder: ((context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: RestaurantCard(
                            restaurantModel: testRestaurantModel[0]),
                      );
                    }))
              ],
            ),
          ))
        ],
      ),
    );
  }
}

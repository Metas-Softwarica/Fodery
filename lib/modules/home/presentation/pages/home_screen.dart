import 'package:flutter/material.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:fodery/modules/core/ui/wrapper/screen_wrapper.dart';
import 'package:fodery/modules/food/data/models/food_model.dart';
import 'package:fodery/modules/food/presentation/widgets/food_card.dart';
import 'package:fodery/modules/restaurant/presentation/widgets/restaurant_card.dart';
import 'package:fodery/modules/home/presentation/widgets/home_search_widget.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return ScreenWrapper(
        route: HOME_ROUTE,
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 1,
          title: Image.asset("assets/icons/logo.png", width: 32, height: 32),
        ),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(
                height: 14,
              ),
              const SearchWidget(),
              const SizedBox(
                height: 14,
              ),
              const Padding(
                padding: EdgeInsets.only(left: 18),
                child: Text(
                  "Popular Restaurants",
                  style: TextStyle(fontFamily: "ManropeBold", fontSize: 16),
                ),
              ),
              const SizedBox(
                height: 8,
              ),
              SizedBox(
                height: 210,
                child: ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.only(left: 18, right: 4),
                    scrollDirection: Axis.horizontal,
                    itemCount: testRestaurantModel.length,
                    itemBuilder: ((context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 14),
                        child: RestaurantCard(
                          restaurantModel: testRestaurantModel[index],
                        ),
                      );
                    })),
              ),
              const SizedBox(
                height: 14,
              ),
              const Padding(
                padding: EdgeInsets.only(left: 18),
                child: Text(
                  "Most Popular",
                  style: TextStyle(fontFamily: "ManropeBold", fontSize: 16),
                ),
              ),
              const SizedBox(
                height: 8,
              ),
              SizedBox(
                height: 210,
                child: ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.only(left: 18, right: 4),
                    scrollDirection: Axis.horizontal,
                    itemCount: testFoodModel.length,
                    itemBuilder: ((context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 14),
                        child: FoodWidget(
                          index: index,
                          foodModel: testFoodModel[index],
                        ),
                      );
                    })),
              ),
              const SizedBox(
                height: 14,
              ),
              const Padding(
                padding: EdgeInsets.only(left: 18),
                child: Text(
                  "Most rated Restaurants",
                  style: TextStyle(fontFamily: "ManropeBold", fontSize: 16),
                ),
              ),
              const SizedBox(
                height: 8,
              ),
              SizedBox(
                height: 210,
                child: ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.only(left: 18, right: 4),
                    scrollDirection: Axis.horizontal,
                    itemCount: testRestaurantModel.length,
                    itemBuilder: ((context, index) {
                      return Padding(
                        padding: EdgeInsets.only(right: 14),
                        child: RestaurantCard(
                          restaurantModel: testRestaurantModel[index],
                        ),
                      );
                    })),
              ),
              const SizedBox(
                height: 14,
              ),
              const Padding(
                padding: EdgeInsets.only(left: 18),
                child: Text(
                  "Most rated foods",
                  style: TextStyle(fontFamily: "ManropeBold", fontSize: 16),
                ),
              ),
              const SizedBox(
                height: 8,
              ),
              SizedBox(
                height: 210,
                child: ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.only(left: 18, right: 4),
                    scrollDirection: Axis.horizontal,
                    itemCount: testFoodModel.length,
                    itemBuilder: ((context, index) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 14),
                        child: FoodWidget(
                          index: index,
                          foodModel: testFoodModel[index],
                        ),
                      );
                    })),
              ),
              const SizedBox(
                height: 14,
              ),
            ],
          ),
        ));
  }
}

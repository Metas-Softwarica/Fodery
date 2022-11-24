class FoodModel {
  final String? name;
  final String? price;
  final String? imageUrl;
  final String? description;
  final int? rating;
  final AddonModel? addonModel;

  const FoodModel(
      {this.name,
      this.price,
      this.imageUrl,
      this.rating,
      this.description,
      this.addonModel});
}

class RestaurantModel {
  final String? name;
  final String? description;
  final String? imageUrl;
  final int? rating;

  const RestaurantModel(
      {this.name, this.description, this.imageUrl, this.rating});
}

class AddonModel {
  final String? name;
  final List<String> items;

  const AddonModel({required this.items, this.name});
}

List<RestaurantModel> testRestaurantModel = [
  const RestaurantModel(
      name: "Frank Restaurant - East Village",
      description:
          "Homestyle Italian fare is served at this quaint, classic restaurant with outdoor seating. ",
      imageUrl:
          "https://lh3.googleusercontent.com/p/AF1QipOyQ_gk1MPGLpoZKE68Sc8Zh8G_SDS64hGiF-w=s680-w680-h510",
      rating: 5)
];

List<FoodModel> testFoodModel = [
  const FoodModel(
      name: "Chicken Parmigiana Sandwich",
      description: "Saucy, cheesy sandwich is the ultimate chicken dinner.",
      price: "18.95",
      imageUrl:
          "https://hips.hearstapps.com/delish/assets/16/31/1470325117-chicken-parml1.jpg",
      rating: 5,
      addonModel: AddonModel(name: "Size", items: ["Small", "Large"]))
];

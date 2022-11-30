import 'package:flutter/material.dart';
import 'package:fodery/modules/authentication/presentation/pages/register_screen.dart';
import 'package:fodery/modules/core/ui/pages/splash_screen.dart';
import 'package:fodery/modules/food/presentation/pages/food_detail_page.dart';
import 'package:fodery/modules/home/presentation/pages/home_screen.dart';
import 'package:fodery/modules/search/presentation/pages/search_screen.dart';
import 'package:vrouter/vrouter.dart';

import '../../authentication/presentation/pages/login_screen.dart';
import '../ui/pages/page_404.dart';
import 'app_routes.dart';

List<VRouteElement> buildRoutes(BuildContext context) {
  return [
    VWidget(
        path: SPLASH_ROUTE,
        name: SPLASH_ROUTE,
        buildTransition: (animation, secondaryAnimation, child) =>
            FadeTransition(
              opacity: animation,
              child: child,
            ),
        widget: const SplashScreen()),
    VWidget(
        path: LOGIN_ROUTE,
        name: LOGIN_ROUTE,
        buildTransition: (animation, secondaryAnimation, child) =>
            FadeTransition(
              opacity: animation,
              child: child,
            ),
        widget: const LoginScreen()),
    VWidget(
        path: REGISTER_ROUTE,
        name: REGISTER_ROUTE,
        buildTransition: (animation, secondaryAnimation, child) =>
            FadeTransition(
              opacity: animation,
              child: child,
            ),
        widget: const RegisterScreen()),
    VWidget(
        path: HOME_ROUTE,
        name: HOME_ROUTE,
        buildTransition: (animation, secondaryAnimation, child) =>
            FadeTransition(
              opacity: animation,
              child: child,
            ),
        widget: const HomeScreen()),
    VWidget(
        path: SEARCH_ROUTE,
        name: SEARCH_ROUTE,
        buildTransition: (animation, secondaryAnimation, child) =>
            FadeTransition(
              opacity: animation,
              child: child,
            ),
        widget: const SearchScreen()),
    VWidget(
        path: FOOD_DETAIL_ROUTE,
        name: FOOD_DETAIL_ROUTE,
        buildTransition: (animation, secondaryAnimation, child) =>
            FadeTransition(
              opacity: animation,
              child: child,
            ),
        widget: const FoodDetailScreen()),
    VWidget(
      path: "*",
      name: "*",
      buildTransition: (animation, secondaryAnimation, child) => FadeTransition(
        opacity: animation,
        child: child,
      ),
      widget: const Page404(),
    ),
  ];
}

import 'package:flutter/material.dart';
import 'package:fodery/modules/authentication/data/source/auth_remote_source.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:vrouter/vrouter.dart';

class ScreenWrapper extends StatefulWidget {
  final AppBar? appBar;
  final Widget child;
  final String route;
  final Widget? endDrawer;
  const ScreenWrapper(
      {super.key,
      this.appBar,
      required this.child,
      required this.route,
      this.endDrawer});

  @override
  State<ScreenWrapper> createState() => _ScreenWrapperState();
}

class _ScreenWrapperState extends State<ScreenWrapper> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: widget.appBar,
      body: SafeArea(child: widget.child),
      endDrawer: widget.endDrawer,
      bottomNavigationBar: SizedBox(
        height: 50,
        child: Column(
          children: [
            Container(
              width: MediaQuery.of(context).size.width,
              height: 1,
              color: AppColors.grey,
            ),
            Expanded(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  IconButton(
                      onPressed: () {
                        if (widget.route != HOME_ROUTE) {
                          context.vRouter.toNamed(HOME_ROUTE);
                        }
                      },
                      icon: Icon(Icons.home,
                          color: (widget.route == HOME_ROUTE)
                              ? AppColors.red
                              : AppColors.grey)),
                  IconButton(
                      onPressed: () {
                        if (widget.route != SEARCH_ROUTE) {
                          context.vRouter.toNamed(SEARCH_ROUTE);
                        }
                      },
                      icon: Icon(Icons.search,
                          color: (widget.route == SEARCH_ROUTE)
                              ? AppColors.red
                              : AppColors.grey)),
                  IconButton(
                      onPressed: () {
                        if (widget.route != CATEGORY_ROUTE) {
                          context.vRouter.toNamed(CATEGORY_ROUTE);
                        }
                      },
                      icon: Icon(Icons.category,
                          color: (widget.route == CATEGORY_ROUTE)
                              ? AppColors.red
                              : AppColors.grey)),
                  InkWell(
                    onTap: () {
                      AuthRemoteSourceImpl().logout(context);
                    },
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(99),
                          image: const DecorationImage(
                              fit: BoxFit.cover,
                              image: AssetImage(
                                  "assets/images/profile_image.png"))),
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

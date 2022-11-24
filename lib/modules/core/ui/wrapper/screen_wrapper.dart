import 'package:flutter/material.dart';
import 'package:fodery/modules/authentication/data/source/auth_remote_source.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';

class ScreenWrapper extends StatefulWidget {
  final AppBar? appBar;
  final Widget child;
  const ScreenWrapper({super.key, this.appBar, required this.child});

  @override
  State<ScreenWrapper> createState() => _ScreenWrapperState();
}

class _ScreenWrapperState extends State<ScreenWrapper> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: widget.appBar,
      body: widget.child,
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
                      onPressed: () {},
                      icon: Icon(Icons.home, color: AppColors.red)),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.search, color: AppColors.grey)),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.category, color: AppColors.grey)),
                  IconButton(
                      onPressed: () {},
                      icon: Icon(Icons.shopping_cart, color: AppColors.grey)),
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

import 'package:flutter/material.dart';

class Page404 extends StatelessWidget {
  const Page404({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            "404",
            style: TextStyle(
                fontFamily: "ManropeBold",
                fontSize: 28,
                color: Colors.grey.shade500),
          ),
          const SizedBox(
            height: 8,
          ),
          Text(
            "Page not Found",
            style: TextStyle(
                fontFamily: "ManropeRegular", color: Colors.grey.shade500),
          )
        ],
      ),
    );
  }
}

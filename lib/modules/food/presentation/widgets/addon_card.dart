import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class AddonWidget extends StatelessWidget {
  const AddonWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () {},
      child: SizedBox(
        width: 140,
        child: Column(
          children: [
            Container(
              height: 140,
              decoration: BoxDecoration(
                  image: const DecorationImage(
                      fit: BoxFit.cover,
                      image: NetworkImage(
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ketchup-01.jpg/655px-Ketchup-01.jpg")),
                  color: AppColors.whiteShade,
                  borderRadius: BorderRadius.circular(12)),
            ),
            Padding(
              padding: const EdgeInsets.all(3),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Ketchep",
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: "ManropeRegular",
                      fontSize: 13,
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "\$ 5",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontFamily: "ManropeBold",
                          fontSize: 16,
                        ),
                      ),
                      Row(
                        children: [
                          Icon(
                            Icons.add_box,
                            color: AppColors.red,
                          ),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 5),
                            child: Text(
                              "1",
                              style: TextStyle(
                                fontFamily: "ManropeRegular",
                                fontSize: 14,
                              ),
                            ),
                          ),
                          Icon(
                            Icons.indeterminate_check_box,
                            color: AppColors.red,
                          )
                        ],
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

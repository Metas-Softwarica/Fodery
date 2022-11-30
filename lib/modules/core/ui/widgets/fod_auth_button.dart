import 'package:flutter/material.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';

class FODButton extends StatefulWidget {
  final String text;
  final Color? backgroundColor;
  final Color? textColor;
  final Function()? onTap;
  const FODButton(
      {super.key,
      required this.text,
      this.onTap,
      this.backgroundColor,
      this.textColor});

  @override
  State<FODButton> createState() => _FODButtonState();
}

class _FODButtonState extends State<FODButton> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: Material(
        color: widget.backgroundColor ?? AppColors.red,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: widget.onTap ?? () {},
          borderRadius: BorderRadius.circular(8),
          child: Container(
            width: MediaQuery.of(context).size.width,
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
            padding: const EdgeInsets.symmetric(vertical: 14),
            child: Center(
              child: Text(
                widget.text,
                style: TextStyle(
                    fontSize: 14, color: widget.textColor ?? Colors.white),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

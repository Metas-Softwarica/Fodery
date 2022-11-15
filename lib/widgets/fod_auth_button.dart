import 'package:flutter/material.dart';

class FODAuthButton extends StatefulWidget {
  final String text;
  const FODAuthButton({super.key, required this.text});

  @override
  State<FODAuthButton> createState() => _FODAuthButtonState();
}

class _FODAuthButtonState extends State<FODAuthButton> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: Material(
        color: Colors.redAccent,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: () {},
          borderRadius: BorderRadius.circular(8),
          child: Container(
            width: MediaQuery.of(context).size.width,
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
            padding: const EdgeInsets.symmetric(vertical: 14),
            child: Center(
              child: Text(
                widget.text,
                style: const TextStyle(fontSize: 14, color: Colors.white),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

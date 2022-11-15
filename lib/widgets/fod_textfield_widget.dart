import 'package:flutter/material.dart';

class FODTextFieldWidget extends StatefulWidget {
  final String labelText;
  final bool isObscureText;
  const FODTextFieldWidget(
      {super.key, required this.labelText, this.isObscureText = false});

  @override
  State<FODTextFieldWidget> createState() => _FODTextFieldWidgetState();
}

class _FODTextFieldWidgetState extends State<FODTextFieldWidget> {
  late bool isObscureText;

  @override
  void initState() {
    isObscureText = widget.isObscureText;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        child: TextField(
          style: const TextStyle(fontSize: 14),
          decoration: InputDecoration(
              contentPadding: const EdgeInsets.all(14),
              focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(width: 0, color: Colors.white)),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(width: 0, color: Colors.white)),
              enabledBorder: const OutlineInputBorder(
                  borderSide: BorderSide(width: 0, color: Colors.white)),
              fillColor: Colors.white,
              filled: true,
              floatingLabelBehavior: FloatingLabelBehavior.never,
              isCollapsed: true,
              alignLabelWithHint: true,
              labelText: widget.labelText,
              prefix: Padding(
                padding: const EdgeInsets.only(right: 8),
                child: Text(
                  widget.labelText,
                  style: const TextStyle(fontSize: 14),
                ),
              ),
              suffixIcon: widget.isObscureText
                  ? InkWell(
                      onTap: () {
                        setState(() {
                          isObscureText = !isObscureText;
                        });
                      },
                      child: Icon(!isObscureText
                          ? Icons.visibility
                          : Icons.visibility_off),
                    )
                  : const SizedBox()),
          obscureText: isObscureText,
        ));
  }
}

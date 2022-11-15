import 'package:flutter/material.dart';
import 'package:fodery/widgets/chip_text_button.dart';
import 'package:fodery/widgets/fod_auth_button.dart';
import 'package:fodery/widgets/fod_textfield_widget.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 245, 245, 245),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(
                  height: 34,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Sign Up",
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "Create your account.",
                        style: TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 24,
                ),
                const FODTextFieldWidget(labelText: "Username"),
                const FODTextFieldWidget(labelText: "Email"),
                const FODTextFieldWidget(
                    labelText: "Password", isObscureText: true),
                const FODTextFieldWidget(
                    labelText: "Confirm", isObscureText: true),
                const SizedBox(
                  height: 12,
                ),
                const FODAuthButton(
                  text: "Sign Up",
                ),
              ],
            ),
            ChipTextButton(
                onTap: () {
                  Navigator.pop(context);
                },
                prefixText: "Already have an account? ",
                suffixText: "Login")
          ],
        ),
      ),
    );
  }
}

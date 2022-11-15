import 'package:flutter/material.dart';
import 'package:fodery/register_screen.dart';
import 'package:fodery/widgets/chip_text_button.dart';
import 'package:fodery/widgets/fod_auth_button.dart';
import 'package:fodery/widgets/fod_textfield_widget.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
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
                        "Welcome back!",
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "Sign into your account.",
                        style: TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 24,
                ),
                const FODTextFieldWidget(labelText: "Email"),
                const FODTextFieldWidget(
                    labelText: "Password", isObscureText: true),
                const SizedBox(
                  height: 12,
                ),
                const FODAuthButton(
                  text: "Sign In",
                ),
              ],
            ),
            ChipTextButton(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: ((context) => const RegisterScreen())));
                },
                prefixText: "New to Fodery? ",
                suffixText: "Register Now")
          ],
        ),
      ),
    );
  }
}

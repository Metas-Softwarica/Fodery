import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fodery/modules/authentication/presentation/pages/register_screen.dart';
import 'package:fodery/modules/authentication/presentation/widgets/chip_text_button.dart';
import 'package:fodery/modules/authentication/presentation/widgets/fod_auth_button.dart';
import 'package:fodery/modules/authentication/presentation/widgets/fod_textfield_widget.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:fodery/modules/core/validators/auth_validators.dart';
import 'package:vrouter/vrouter.dart';

import '../../data/models/user_auth_model.dart';
import '../blocs/login/login_bloc.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final GlobalKey<FormState> _loginFormKey = GlobalKey<FormState>();
  late TextEditingController _email;
  late TextEditingController _password;

  @override
  void initState() {
    _email = TextEditingController();
    _password = TextEditingController();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 245, 245, 245),
      body: SafeArea(
        child: BlocConsumer<LoginBloc, LoginState>(
          listener: (context, state) {
            if (state is LoginSuccessState) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text(state.message)));
              context.vRouter.toNamed(HOME_ROUTE);
            } else if (state is LoginFailedState) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text(state.errorMessage)));
            }
          },
          builder: (context, state) {
            return Form(
              key: _loginFormKey,
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
                      FODTextFieldWidget(
                          labelText: "Email",
                          validator: AuthValidators.validateEmail,
                          controller: _email),
                      FODTextFieldWidget(
                          labelText: "Password",
                          isObscureText: true,
                          validator: AuthValidators.validatePassword,
                          controller: _password),
                      const SizedBox(
                        height: 5,
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Align(
                            alignment: Alignment.centerRight,
                            child: ChipTextButton(
                                onTap: () {}, prefixText: "Forgot Password?")),
                      ),
                      const SizedBox(
                        height: 14,
                      ),
                      FODAuthButton(
                        onTap: () {
                          if (!_loginFormKey.currentState!.validate()) {
                            return;
                          }
                          context.read<LoginBloc>().add(LoginClickedEvent(
                              authModel: UserAuthModel(
                                  email: _email.text,
                                  password: _password.text)));
                        },
                        text: "Sign In",
                      ),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(14),
                    child: ChipTextButton(
                        onTap: () {
                          context.vRouter.toNamed(REGISTER_ROUTE);
                        },
                        prefixText: "New to Fodery? ",
                        suffixText: "Register Now"),
                  )
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

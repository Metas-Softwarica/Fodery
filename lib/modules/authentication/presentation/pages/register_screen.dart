import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fodery/modules/authentication/data/models/user_auth_model.dart';
import 'package:fodery/modules/authentication/presentation/widgets/chip_text_button.dart';
import 'package:fodery/modules/authentication/presentation/widgets/fod_auth_button.dart';
import 'package:fodery/modules/authentication/presentation/widgets/fod_textfield_widget.dart';
import 'package:vrouter/vrouter.dart';

import '../../../core/validators/auth_validators.dart';
import '../blocs/register/register_bloc.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final GlobalKey<FormState> _registerFormKey = GlobalKey<FormState>();
  late TextEditingController _firstName;
  late TextEditingController _lastName;
  late TextEditingController _email;
  late TextEditingController _password;
  late TextEditingController _confirmPassword;

  @override
  void initState() {
    _firstName = TextEditingController();
    _lastName = TextEditingController();
    _email = TextEditingController();
    _password = TextEditingController();
    _confirmPassword = TextEditingController();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 245, 245, 245),
      body: SafeArea(
        child: BlocConsumer<RegisterBloc, RegisterState>(
          listener: (context, state) {
            if (state is UserRegisteredState) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text(state.message)));
              context.vRouter.historyBack();
            } else if (state is UserRegisterFailedState) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text(state.message)));
            }
          },
          builder: (context, state) {
            return SingleChildScrollView(
              child: Form(
                key: _registerFormKey,
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
                        FODTextFieldWidget(
                          labelText: "First Name",
                          validator: AuthValidators.validateFirstName,
                          controller: _firstName,
                        ),
                        FODTextFieldWidget(
                          labelText: "Last Name",
                          validator: AuthValidators.validateLastname,
                          controller: _lastName,
                        ),
                        FODTextFieldWidget(
                          labelText: "Email",
                          validator: AuthValidators.validateEmail,
                          controller: _email,
                        ),
                        FODTextFieldWidget(
                            labelText: "Password",
                            validator: AuthValidators.validatePassword,
                            controller: _password,
                            isObscureText: true),
                        FODTextFieldWidget(
                            labelText: "Confirm",
                            validator: AuthValidators.validatePassword,
                            controller: _confirmPassword,
                            isObscureText: true),
                        const SizedBox(
                          height: 12,
                        ),
                        FODAuthButton(
                          text: "Sign Up",
                          onTap: () {
                            if (!_registerFormKey.currentState!.validate()) {
                              return;
                            }
                            if (_password.text != _confirmPassword.text) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                      content: Text("Password don't match.")));
                              return;
                            }
                            context.read<RegisterBloc>().add(
                                RegisterFormSubmitted(
                                    userModel: UserAuthModel(
                                        firstName: _firstName.text,
                                        lastName: _lastName.text,
                                        email: _email.text,
                                        password: _password.text)));
                          },
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.all(14),
                      child: ChipTextButton(
                          onTap: () {
                            context.vRouter.historyBack();
                          },
                          prefixText: "Already have an account? ",
                          suffixText: "Login"),
                    )
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

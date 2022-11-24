import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fodery/modules/core/constants/app_colors.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:vrouter/vrouter.dart';

import '../../../authentication/presentation/blocs/authChecker/authcheck_bloc.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AuthcheckBloc()..add(AuthCheckaAttempt()),
      child: BlocListener<AuthcheckBloc, AuthcheckState>(
        listener: (context, state) {
          if (state is Authenticated) {
            context.vRouter.toNamed(HOME_ROUTE);
          } else {
            context.vRouter.toNamed(LOGIN_ROUTE);
          }
        },
        child: Scaffold(
          backgroundColor: AppColors.black,
          body: SizedBox(
            width: MediaQuery.of(context).size.width,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset("assets/icons/logo_shade.png",
                    width: 50, height: 50, fit: BoxFit.contain),
                const SizedBox(
                  height: 24,
                ),
                SizedBox(
                  width: 50,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(5),
                    child: LinearProgressIndicator(
                      minHeight: 2,
                      color: AppColors.greyDark,
                      backgroundColor: Colors.white,
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}

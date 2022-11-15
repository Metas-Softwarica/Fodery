import 'package:flutter/material.dart';
import 'package:fodery/modules/authentication/presentation/blocs/login/login_bloc.dart';
import 'package:fodery/modules/authentication/presentation/blocs/register/register_bloc.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:vrouter/vrouter.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'modules/core/routes/route_builder.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => LoginBloc(),
        ),
        BlocProvider(
          create: (context) => RegisterBloc(),
        ),
      ],
      child: VRouter(
        title: 'Fodery',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        mode: VRouterMode.history,
        initialUrl: SPLASH_ROUTE,
        routes: buildRoutes(context),
      ),
    );
  }
}

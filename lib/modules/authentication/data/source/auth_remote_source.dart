import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:fodery/modules/authentication/data/models/user_auth_model.dart';
import 'package:fodery/modules/core/routes/app_routes.dart';
import 'package:http/http.dart' as http;
import 'package:vrouter/vrouter.dart';

import '../../../core/constants/api_paths.dart';
import '../../../core/services/secure_storage.dart';

abstract class AuthRemoteSource {
  Future<UserAuthModel> registerSource({required UserAuthModel userModel});
  Future<UserAuthModel> loginSource({required UserAuthModel userModel});
  Future<bool> autoAuthenticationAttempt();
}

class AuthRemoteSourceImpl implements AuthRemoteSource {
  @override
  Future<UserAuthModel> registerSource(
      {required UserAuthModel userModel}) async {
    try {
      var url = Uri.parse(ApiPaths.registerUrl);
      var res = await http
          .post(
            url,
            body: userModel.toJsonForRegistration(),
          )
          .timeout(const Duration(seconds: 30));
      print(res.statusCode);
      if (res.statusCode == 201) {
        UserAuthModel data =
            UserAuthModel.fromJsonForTokens(map: jsonDecode(res.body));
        return data;
      } else if (res.statusCode == 406) {
        return Future.error(jsonDecode(res.body)["detail"]);
      } else {
        print(res.body);
        return Future.error("User Registration Failed!");
      }
    } catch (e) {
      print(e.toString());
      return Future.error(e.toString());
    }
  }

  @override
  Future<UserAuthModel> loginSource({required UserAuthModel userModel}) async {
    try {
      var url = Uri.parse(ApiPaths.loginUrl);
      var res = await http
          .post(
            url,
            body: userModel.toJsonForLogin(),
          )
          .timeout(const Duration(seconds: 30));
      print(res.statusCode);
      if (res.statusCode == 200) {
        UserAuthModel data =
            UserAuthModel.fromJsonForTokens(map: jsonDecode(res.body));
        return data;
      } else {
        return Future.error("User Authentication Failed!");
      }
    } catch (e) {
      return Future.error('User Authentication Failed!');
    }
  }

  @override
  Future<bool> autoAuthenticationAttempt() async {
    try {
      SecureStorage secureStorage = SecureStorage();
      String? token = await secureStorage.getLocalToken();
      if (token != null) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> logout(BuildContext context) async {
    try {
      SecureStorage().deleteLocalToken();
      context.vRouter.toNamed(SPLASH_ROUTE);
    } catch (e) {
      // return false;
    }
  }
}

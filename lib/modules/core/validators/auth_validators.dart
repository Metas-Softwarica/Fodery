import 'package:fodery/modules/core/utils/string_extension.dart';

class AuthValidators {
  static String? validateFirstName(String? value) {
    if (value != null && value != "") {
      return null;
    } else {
      return "First name is required.";
    }
  }

  static String? validateLastname(String? value) {
    if (value != null && value != "" && value != "") {
      return null;
    } else {
      return "Last name is required.";
    }
  }

  static String? validateEmail(String? value) {
    if (value != null && value != "" && value.isEmail()) {
      return null;
    } else {
      return "Enter valid email address";
    }
  }

  static String? validatePassword(String? value) {
    if (value != null && value != "" && value.length >= 8) {
      return null;
    } else {
      return "Password needs to be at least 8 digits.";
    }
  }
}

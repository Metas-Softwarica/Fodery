import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  final FlutterSecureStorage secureStorage;

  SecureStorage({this.secureStorage = const FlutterSecureStorage()});

  Future<String?> getLocalToken() async {
    String? value = await secureStorage.read(key: "token");
    return value;
  }

  Future<bool> storeTokenLocally({required String token}) async {
    await secureStorage.write(key: "token", value: token);
    if ((await getLocalToken()) != null) {
      return true;
    } else {
      return false;
    }
  }

  Future deleteLocalToken() async {
    await secureStorage.delete(key: "token");
  }
}

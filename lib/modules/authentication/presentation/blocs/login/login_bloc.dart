import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../../core/services/secure_storage.dart';
import '../../../data/models/user_auth_model.dart';
import '../../../data/source/auth_remote_source.dart';

part 'login_event.dart';
part 'login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final AuthRemoteSourceImpl _authRepo = AuthRemoteSourceImpl();
  LoginBloc() : super(LoginInitial()) {
    on<LoginEvent>((event, emit) {});
    on<LoginClickedEvent>(
        (event, emit) => handleLoginClickedEvent(event, emit));
  }

  handleLoginClickedEvent(
      LoginClickedEvent event, Emitter<LoginState> emit) async {
    emit(LoginLoadingState());
    try {
      UserAuthModel userWithToken =
          await _authRepo.loginSource(userModel: event.authModel);
      print(userWithToken.accessToken);
      if (userWithToken.accessToken != null) {
        final isSavedTokenLocally = await SecureStorage()
            .storeTokenLocally(token: userWithToken.accessToken!);
        emit(const LoginSuccessState(message: "Logged in successfully."));
      } else {
        emit(const LoginFailedState(errorMessage: "Server Error!"));
      }
    } catch (e) {
      print("here");
      emit(LoginFailedState(errorMessage: e.toString()));
    }
  }
}

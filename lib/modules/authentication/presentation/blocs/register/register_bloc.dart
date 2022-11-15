import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:fodery/modules/authentication/data/models/user_auth_model.dart';
import 'package:fodery/modules/authentication/data/source/auth_remote_source.dart';

part 'register_event.dart';
part 'register_state.dart';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final AuthRemoteSourceImpl _authRepo = AuthRemoteSourceImpl();
  RegisterBloc() : super(RegisterInitial()) {
    on<RegisterEvent>((event, emit) {});
    on<RegisterFormSubmitted>(
        (event, emit) => registerFormSubmittedEventMapped(event, emit));
  }

  registerFormSubmittedEventMapped(
      RegisterFormSubmitted event, Emitter<RegisterState> emit) async {
    emit(RegisterAttemptLoadingState());
    try {
      UserAuthModel userWithToken =
          await _authRepo.registerSource(userModel: event.userModel);
      emit(const UserRegisteredState(
          message:
              "You have been registered. Login to continue your account."));
    } catch (e) {
      print("here");
      emit(UserRegisterFailedState(message: e.toString()));
    }
  }
}

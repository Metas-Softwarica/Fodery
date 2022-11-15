import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../data/source/auth_remote_source.dart';

part 'authcheck_event.dart';
part 'authcheck_state.dart';

class AuthcheckBloc extends Bloc<AuthcheckEvent, AuthcheckState> {
  final AuthRemoteSourceImpl _authRepo = AuthRemoteSourceImpl();
  AuthcheckBloc() : super(AuthcheckInitial()) {
    on<AuthcheckEvent>((event, emit) {});
    on<AuthCheckaAttempt>(
        (event, emit) => authenticateAttempt(event: event, emit: emit));
  }

  authenticateAttempt(
      {required AuthCheckaAttempt event,
      required Emitter<AuthcheckState> emit}) async {
    if (await _authRepo.autoAuthenticationAttempt()) {
      emit(Authenticated(message: ""));
    } else {
      emit(AuthenticationFailed(message: ""));
    }
  }
}
